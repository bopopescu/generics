#!/usr/bin/env python

import sys
sys.path.append("/afs/ir/group/cocolab/cgi-bin/dj/exp/config/boto/")

import cgi
import cgitb; cgitb.enable()  # for troubleshooting

import boto
import time
from boto.mturk.connection import MTurkConnection
#not sure if I need these
from boto.mturk.connection import *



deserving = ["A1F9GC0S483YUH", "A1J9A6AK240KEX", "A1YSYI926BBOHW", "A2HM35CWB7IIFM", "A2NSVUIQQ112WC", "A34RKBL0KGEJ39", "A3BKIVVRFP7X6M", "A3HXZ7KK6ST9BY", "A3KVY5OQKQ8MUC", "AO3XB5I5QNNUI"]

SAND = 0

if SAND==1:
    print "sandbox"
    HOST = 'mechanicalturk.sandbox.amazonaws.com'
else:
    print "not Sandbox"
    HOST = 'mechanicalturk.amazonaws.com'


conn = MTurkConnection(aws_access_key_id=ACCESS_ID,
                     aws_secret_access_key=SECRET_KEY,
                    host=HOST)

def accept_and_pay(worker_id, assign_id, bonus_price, reason):
  """pays for assignment; returns False if something went wrong, else True"""
  try:
    result = conn.approve_assignment(assign_id)
  except MTurkRequestError:
    print "Couldn't pay"
    #TODO: make sure to avoid the possibility of paying the same bonus twice
  try:
    if bonus_price > 0:
      conn.grant_bonus(worker_id, assign_id, Price(amount=bonus_price), reason)
  except MTurkRequestError:
    #TODO: less embarrasing error handling
    print "Couldn't give bonus"
    return False# no bonus if already paid for
  return True


for worker in deserving:
    print worker
    ##accept_and_pay(worker_id=WORKER_ID, assign_id=ASSIGNMENT_ID, bonus_price=BONUS, reason="Congratulations!")
    ##print "paid: %s (+%f)" % (WORKER_ID, BONUS)
