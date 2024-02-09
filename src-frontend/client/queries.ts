import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/constants";
import { FileMetadata, getFileUploadMetadata } from "./requests";

export function useUploadMetadataQuery(
  files: string[]
): UseQueryResult<FileMetadata[] | null, unknown> {
  return useQuery<FileMetadata[] | null, unknown>({
    queryKey: [QUERY_KEYS.file_upload_metadata],
    queryFn: () => getFileUploadMetadata(files),
    enabled: files.length > 0,
  });
}
