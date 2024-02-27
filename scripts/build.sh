echo "Packaging python environment"

export PYSERVER_PATH=$(pwd)/src-server/src/

npx kill-port 8000
rm -rf src-tauri/binaries/
rm -rf src-server/build/
cd src-tauri
mkdir binaries
cd ..
cd src-server 
pyoxidizer build --var PYSERVER_PATH "$PYSERVER_PATH"
cd ..
cp -r src-server/build src-tauri/binaries/
echo "Done packaging python environment"
