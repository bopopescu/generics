#!/bin/bash
export JAVA_HOME=/usr/
echo "in shell script"
cd /afs/ir/group/cocolab/cgi-bin/dj/exp/config/turk/bin
./temp.sh
./extendHITs.sh -assignments 1 -successfile ./success
