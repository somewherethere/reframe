#!/usr/bin/env bash
mkdir _release
git clone -b release git@github.com:thinktopography/reframe _release
cd _release
cp -f ../package.json ./package.json
babel -d ./ ../src/
sass -Cq --scss --compass --sourcemap=none ../src/reframe.scss ./reframe.css

VER=`cat package.json | sed -n 's/.*"version": "\(.*\)".*/\1/p'`

if (git tag | grep $VER); then
    echo "Error: release $VER already exists"; exit 1
fi

git add .
git commit -m "Release $VER" -e
git push
cd ../
rm -rf _release
