import subprocess
import os

def package_python_environment():
    pyserv_path = os.path.join(os.getcwd(), 'src-server', 'src')
    os.environ['PYSERVER_PATH'] = pyserv_path

    subprocess.run(['npx', 'kill-port', '8000'], shell=True)

    subprocess.run(['rm', '-rf', 'src-tauri/binaries/'])
    subprocess.run(['rm', '-rf', 'src-server/build/'])

    os.makedirs('src-tauri/binaries', exist_ok=True)

    os.chdir('src-server')
    subprocess.run(['pyoxidizer', 'build', '--var', 'PYSERVER_PATH', pyserv_path])
    os.chdir('..')

    subprocess.run(['cp', '-r', 'src-server/build', 'src-tauri/binaries/'])

    print("Done packaging python environment")

if __name__ == "__main__":
    subprocess.run(['npm', 'install'], shell=True)
    package_python_environment()
    subprocess.run(['npm', 'run', 'tauri', 'build'], shell=True)
