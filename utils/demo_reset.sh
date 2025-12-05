#!/bin/bash

gemini extensions uninstall gemini-cli-security
git reset --hard main && git clean -fd