#!/usr/bin/env python

import sys
#sys.path.append("~/Tools/boto/")

import cgi
import cgitb; cgitb.enable()  # for troubleshooting

import boto
import time
from boto.mturk.connection import MTurkConnection
#not sure if I need these
from boto.mturk.connection import *
# from boto.mturk.question import *
# from boto.mturk.price import *
# from boto.mturk.qualification import *
# from boto.s3 import *
# from os.path import *
# import urllib
###end not sure ####

print "Content-type: text/html"
print
# form = cgi.FieldStorage()
# HIT  = form.getfirst("HID", "empty")
# SAND = int(form.getfirst("sandbox", "empty"))
# WORKER_ID = form.getfirst("WID", "empty")
# ASSIGNMENT_ID = form.getfirst("AID", "empty")
# BONUS = float(form.getfirst("BONUS", "empty"))
ASSIGNMENT_ID = "29EAZHHRRLFQ2YNF1L81NHO9E1BNE6"
HIT = "2522JE1M7PKKBVROCIQAF04L57RXQI"
WORKER_ID = "A1U20KMVGHTLDK"
SAND = 1
BONUS = .5
ACCESS_ID = 'AKIAIM5D5I7RUTGYNI7A'
SECRET_KEY = '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'

print SAND
print type(SAND)
#HIT="2JNL8I9NZW6HG96GKYHWCT87ATCVL9"
#HOST = 'mechanicalturk.amazonaws.com'




# https://mechanicalturk.amazonaws.com/?Service=AWSMechanicalTurkRequester
if SAND==1:
    print "sandbox"
    HOST = 'mechanicalturk.sandbox.amazonaws.com'
else:
    print "not Sandbox"
    HOST = 'mechanicalturk.amazonaws.com'


conn = MTurkConnection(aws_access_key_id=ACCESS_ID,
                     aws_secret_access_key=SECRET_KEY,
                    host=HOST)

print conn.get_account_balance()


def accept_and_pay(worker_id, assign_id, bonus_price, reason):
  """pays for assignment; returns False if something went wrong, else True"""
  try:
      #result = conn.approve_assignment(assign_id)
    #TODO: make sure to avoid the possibility of paying the same bonus twice
    if bonus_price > 0:
      conn.grant_bonus(worker_id, assign_id, Price(amount=bonus_price), reason)
  except MTurkRequestError:
    #TODO: less embarrasing error handling
    print "looks like this one was already paid for. or, any other error"
    return False# no bonus if already paid for
  return True

#time.sleep(20)

accept_and_pay(worker_id=WORKER_ID, assign_id=ASSIGNMENT_ID, bonus_price=BONUS, reason="Congratulations!")
print "paid: %s (+%f)" % (WORKER_ID, BONUS)
