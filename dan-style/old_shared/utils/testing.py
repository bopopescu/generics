#!/usr/bin/env python

import sys
sys.path.append("/afs/ir/group/cocolab/cgi-bin/dj/exp/config/boto/")

import cgi
import cgitb; cgitb.enable()  # for troubleshooting

import boto
import time
from boto.mturk.connection import MTurkConnection
from boto.mturk.connection import *

import json
import ipdb

### Globals #####
ACCESS_ID = 'AKIAIM5D5I7RUTGYNI7A'
SECRET_KEY = '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'

DIRECTORY = '/Users/djthorne/git/connect2/modcd/analysis/data/'
NAME = "take1"

SHOW_DATA = 0
BONUS = .25
SAND = 0
DELETE = 0
PAY = 1



if SAND==1:
    print "sandbox"
    HOST = 'mechanicalturk.sandbox.amazonaws.com'
else:
    print "not Sandbox"
    HOST = 'mechanicalturk.amazonaws.com'


### Functions ###
def get_all_reviewable_hits(mtc):
    page_size = 5
    hits = mtc.get_reviewable_hits(page_size=page_size)
    print "Total results to fetch %s " % hits.TotalNumResults
    print "Request hits page %i" % 1
    total_pages = float(hits.TotalNumResults)/page_size
    int_total= int(total_pages)
    if(total_pages-int_total>0):
        total_pages = int_total+1
    else:
        total_pages = int_total
    pn = 1
    while pn < total_pages:
        pn = pn + 1
        print "Request hits page %i" % pn
        temp_hits = mtc.get_reviewable_hits(page_size=page_size,page_number=pn)
        hits.extend(temp_hits)
    return hits

def get_answers(hit_id):
    """return a list of tuples (answer, worker_id, assignment_id)"""
    assignments = mtc.get_assignments(hit_id=hit_id, page_size=100)
    pagenumber = 1
    while (len(assignments) < int(assignments.TotalNumResults)) :
        pagenumber +=1;
        assignments.extend(mtc.get_assignments(hit_id=hit_id, page_size=100, page_number= pagenumber))
    return [{'data' : assign.answers[0], 'workerId': assign.WorkerId, 'assignmentId' : assign.AssignmentId} for assign in assignments]


def accept_and_pay(worker_id, assign_id, bonus_price, reason):
  """pays for assignment; returns False if something went wrong, else True"""
  try:
    result = mtc.approve_assignment(assign_id)
    print "Paid"
    try:
        if bonus_price > 0:
            mtc.grant_bonus(worker_id, assign_id, Price(amount=bonus_price), reason)
            print "Paid Bonus %s" % (bonus_price)
    except MTurkRequestError:
        print "Couldn't give bonus"
        return False# no bonus if already paid for
    return True
  except MTurkRequestError:
    print "Couldn't pay"
    return False

def pay_bonus(worker_id, assign_id, bonus_price, reason):
  """pays for assignment; returns False if something went wrong, else True"""
  try:
    if bonus_price > 0:
      mtc.grant_bonus(worker_id, assign_id, Price(amount=bonus_price), reason)
  except MTurkRequestError:
    print "Couldn't give bonus"
    return False# no bonus if already paid for
  return True

def pay_bonus_d(worker_id, assign_id, bonus_price, reason):
    mtc.grant_bonus(worker_id, assign_id, Price(amount=bonus_price), reason)


######## Script Starts #######

mtc = MTurkConnection(aws_access_key_id=ACCESS_ID,
                     aws_secret_access_key=SECRET_KEY,
                    host=HOST)

hits = get_all_reviewable_hits(mtc)

print mtc.get_account_balance()
