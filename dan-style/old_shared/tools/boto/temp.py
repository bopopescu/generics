import os
print os.getcwd()
import sys 

import boto
from boto.mturk.connection import MTurkConnection

SAND = 0 
ACCESS_ID = 'AKIAIM5D5I7RUTGYNI7A'
SECRET_KEY = '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'
HIT="2JNL8I9NZW6HG96GKYHWCT87ATCVL9"

# https://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester
HOST = 'mechanicalturk.amazonaws.com'
 
mtc = MTurkConnection(aws_access_key_id=ACCESS_ID,
                      aws_secret_access_key=SECRET_KEY,
                      host=HOST)

print mtc.get_account_balance()
mtc.extend_hit(hit_id=HIT, assignments_increment=1)

