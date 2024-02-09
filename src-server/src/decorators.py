from contextlib import contextmanager
from functools import wraps
import inspect
from fastapi import HTTPException
import logging
from config import is_debug, is_dev

from log import capture_stack_frame, get_context_frame_params, get_logger


def http_response(endpoint_call_success_msg=""):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger = get_logger()
            try:
                result = func(*args, **kwargs)
                if endpoint_call_success_msg != "":
                    logger.log(endpoint_call_success_msg, logging.INFO)
                return result
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        return wrapper

    return decorator


@contextmanager
def LogException(
    custom_handler=None,
    logging_level=logging.ERROR,
    ui_dom_event="",
    notification_duration=5000,
    re_raise=True,
    success_log_msg="",
):
    logger = get_logger()
    if is_debug():
        stack_frame = capture_stack_frame(
            inspect.stack()[2].function, get_context_frame_params()
        )
        logger.log(
            stack_frame,
            logging.INFO,
            False,
            False,
        )
    try:
        yield
        if success_log_msg != "":
            logger.log(success_log_msg, logging.INFO)
    except Exception as e:
        if custom_handler and custom_handler(e):
            return
        stack_frame = capture_stack_frame(
            inspect.stack()[2].function, get_context_frame_params()
        )
        logger.save_exception_stackframe(stack_frame, str(e))
        logger.log(
            f"{str(e)}",
            logging_level,
            False,
            False,
            ui_dom_event,
            notification_duration,
        )
        if re_raise:
            raise
