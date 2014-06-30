#!/usr/bin/env python
import sys 
sys.path.append("/afs/ir/group/cocolab/cgi-bin/dj/exp/config/boto/")

import cgi
import cgitb; cgitb.enable()  # for troubleshooting

import boto
from boto.mturk.connection import MTurkConnection

print "Content-type: text/html"
print


form = cgi.FieldStorage()
HIT  = form.getfirst("ID", "empty")
SAND = form.getfirst("sandbox", "empty")

ACCESS_ID = 'AKIAIM5D5I7RUTGYNI7A'
SECRET_KEY = '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'

#HIT="2JNL8I9NZW6HG96GKYHWCT87ATCVL9"
#HOST = 'mechanicalturk.amazonaws.com'


# https://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester
if SAND==1:
    print "sandbox"
    HOST = 'mechanicalturk.sandbox.amazonaws.com'
else:
    print "not Sandbox"
    HOST = 'mechanicalturk.amazonaws.com'

 
mtc = MTurkConnection(aws_access_key_id=ACCESS_ID,
                     aws_secret_access_key=SECRET_KEY,
                    host=HOST)

print mtc.get_account_balance()
mtc.extend_hit(hit_id=HIT, assignments_increment=1)








