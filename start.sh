#!/bin/bash

pushd frontend
npm run build
popd

pushd backend
npm run start
popd