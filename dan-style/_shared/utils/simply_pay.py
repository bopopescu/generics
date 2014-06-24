#!/usr/bin/env python

import sys, boto, time, json, ipdb
from boto.mturk.connection import MTurkConnection
from boto.mturk.connection import *

### Globals #####
ACCESS_ID = 'AKIAIM5D5I7RUTGYNI7A'
SECRET_KEY = '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'

DIRECTORY = '/Users/djthorne/git/connect2/modcd/analysis/data/'

SHOW_DATA = 0
BONUS = .20
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
  except MTurkRequestError:
    print "Couldn't pay"
    return False

######## Script Starts #######

mtc = MTurkConnection(aws_access_key_id=ACCESS_ID,
                     aws_secret_access_key=SECRET_KEY,
                    host=HOST)

hits = get_all_reviewable_hits(mtc)


def pay_workers(pay=PAY, nopay=[]):
    for hit in hits:
        print "!!!!!! Hit %s !!!!!!" % hit
        assignments = get_answers(hit.HITId)
        for assignment in assignments:
            print "---------------------"
            print "Answers of the worker %s" % assignment['workerId']
            if pay:
                if assignment['workerId'] not in nopay:
                    print "Worker %s gets a bonus of %s" % (assignment['workerId'], 0)
                    accept_and_pay(worker_id=assignment['workerId'], assign_id=assignment['assignmentId'], bonus_price=0, reason="Congratulations, you got a bonus!")
                else:
                    try:
                        mtc.reject_assignment(assignment_id=assignment['assignmentId'], feedback="You did not read the instructions")
                        print "rejected %s" % (assignment['workerId'])
                    except MTurkRequestError:
                        print "Couldn't reject"




if __name__ == '__main__':
    pay_workers(pay=1)
