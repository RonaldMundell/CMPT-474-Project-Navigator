#!/bin/bash
# Installs all the node modules required by each service, requires node v18

cd ./services || exit

run_npm_install_if_package_json_exists() {
	local dir="$1"
	if [[ -f "$dir/package.json" ]]; then
		echo "Found package.json in $dir"
		(cd "$dir" && npm i)
	else
		echo "No package.json found in $dir"
	fi
}

node_version=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)

if [[ "$node_version" -eq 18 ]]; then
	export -f run_npm_install_if_package_json_exists

	find . -maxdepth 1 -mindepth 1 -type d -exec bash -c 'run_npm_install_if_package_json_exists "$0"' {} \;
else
	echo "Node.js version 18 is required. Current version: $node_version"
fi
