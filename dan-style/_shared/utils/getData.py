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
PAY = 0



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

# for hit in hits:
#     assignments = mtc.get_assignments(hit.HITId)

#     for assignment in assignments:
#         print "Answers of the worker %s" % assignment.WorkerId

#     if DELETE==1:
#         mtc.disable_hit(hit.HITId)


def how_many_workers():
     for hit in hits:
        print "--------"
        assignments = get_answers(hit.HITId)
        print len(assignments)
        return assignments

def pay_workers_old(pay=PAY):
    for hit in hits:
        assignments = get_answers(hit.HITId)
        for assignment in assignments:
            print "Answers of the worker %s" % assignment['workerId']
            givebonus=0
            bonus_amount = 0
            for trial in assignment['data']:
                trial = json.loads(trial.fields[0])
                print "---------------------"
                for key, value in trial.iteritems():
                    if key=="bonus" and value==1 :
                        givebonus += 1
                    if key=="cond" and value.find("continuous") != -1 :
                        givebonus += 1
                    if key=="bonusvalue":
                        value

        if pay and givebonus >= 2 :
            "Worker %s gets a bonus of %s" % (assignment['workerId'], bonus_amount)
            accept_and_pay(worker_id=assignment['workerId'], assign_id=assignment['assignmentId'], bonus_price=bonus_amount, reason="Congratulations, you got a bonus!")


nopay=[5,14,19,20,26,27,30,32,34,38,49,52,53,70,75,77,82,85,90,111,116,142,146,162]

def pay_workers(pay=PAY):
    assignments = get_answers(hits[0].HITId)
    for assignment in assignments:
        print "---------------------"
        print "Answers of the worker %s" % assignment['workerId']
        givebonus=0
        bonus_amount = 0
        for trial in assignment['data']:
            trial = json.loads(trial.fields[0])
            for key, value in trial.iteritems():
                # if key=="awake" and value==0:
                #     goodun = 0
                if key=="bonus" and value==1 :
                    # print "bonus value is 1"
                    givebonus = 1
                if key=="bonusvalue":
                    bonus_amount = float(value)
                    print "bonus value is %s" % (value)
        if givebonus < 1:
            bonus_amount = 0
        if pay:
            if assignment['workerId'] not in nopay:
                print "Worker %s gets a bonus of %s" % (assignment['workerId'], bonus_amount)
                accept_and_pay(worker_id=assignment['workerId'], assign_id=assignment['assignmentId'], bonus_price=bonus_amount, reason="Congratulations, you got a bonus!")
            else:
                try:
                    mtc.reject_assignment(assignment_id=assignment['assignmentId'], feedback="You did not read the instructions")
                    print "rejected %s" % (assignment['workerId'])
                except MTurkRequestError:
                    print "Couldn't reject"




def pw(pay=PAY):
    g=0
    assignments = get_answers(hits[0].HITId)
    for assignment in assignments:
        g = g+1
        print "Answers of the worker %s" % assignment['workerId']
        if assignment['workerId'] == "A1VHFF2VC2XG7P":
            ipdb.set_trace()
            print "inside"
        print "---------------------"
    print g


def paym():
    for hit in hits:
        assignments = get_answers(hit.HITId)
        for assignment in assignments:
            print "Answers of the worker %s" % assignment['workerId']
            givebonus=0
            for trial in assignment['data']:
                trial = json.loads(trial.fields[0])
                print "---------------------"
                for key, value in trial.iteritems():
                    if SHOW_DATA:
                        print "%s %s" % (key,value)
                        if PAY:
                            if key=="bonus":
                                print "the bonus is %d" % (value)
                                if value==1:
                                    if(accept_and_pay(worker_id=assignment['workerId'], assign_id=assignment['assignmentId'], bonus_price=BONUS, reason="Congratulations, you got the Bonus Question correct!")):
                                        print "paid: %s (+%f)" % (assignment['workerId'], BONUS)
                                else:
                                    if(accept_and_pay(worker_id=assignment['workerId'], assign_id=assignment['assignmentId'], bonus_price=0, reason="Congratulations, you got the Bonus Question correct!")):
                                        print "paid: %s" % (assignment['workerId'])
    if DELETE==1:
        mtc.disable_hit(hit.HITId)


def to_csv():
    import csv
    for sub in ["0","1"]:
        hit = hits[int(sub)]
        with open(DIRECTORY + NAME + sub + ".csv","w") as f:
            out=csv.writer(f, delimiter=',' , quoting=csv.QUOTE_ALL)
            title = ["id", "cond", "phaseid", "phase", "t", "t_start", "catch", "slide_timeundefinedbonus", "subsize", "num_test", "subdiv", "propundefinedfeedback", "workerId", "Browser", "OS", "screenH", "screenW", "trial_timeundefinedixo", "ixp", "resp", "correct", "color", "trial_time", "sid"]
            out.writerow(title)
            assignments = get_answers(hit.HITId)
            sid=0
            for assignment in assignments:
                sid+=1
                for trial in assignment['data']:
                    trial = json.loads(trial.fields[0])
                    text = []
                    for key in title:
                        if trial.has_key(key):
                            text.append(trial[key])
                        else:
                            text.append("NA")
                    text[-1]=sid
                    out.writerow(text)
                        #ipdb.set_trace()
                        # for key, value in trial.iteritems():
                        #      trial.has_key("catch")
                        # for key in trial

                        # pdb.set_trace()





                    #

# assignments = []

# for hit in hits:
#         assignments.append(get_answers(hit.HITId))

#ipdb; ipdb.set_trace()
#from IPython.Shell import IPShellEmbed; IPShellEmbed()()


# bonus=("A10888G3BQMTBF", "A10LRC0EGCZDZ3", "A11IFPCHHXZMEM", "A11ZCA2QVQ2HLC",
# "A1434R69YV3Y3I", "A1610EPXM31F9D", "A16UEAVU1XYI79", "A17DTZRTJANBXL",
# "A195I247BW5F6F", "A19EXFL4C3BN5B", "A19RUEYADULHZN", "A1A410AF03DQBV",
# "A1B5G9IXNRROII", "A1CTJ8UT7SF317", "A1FA4FW3XS05DI", "A1FJIRQ11GHC66",
# "A1GFD4B3NOMWIY", "A1J9A6AK240KEX", "A1JH67DVZ2U0FV", "A1MEUWBTRR86VA",
# "A1N8GTWT0RRAIS", "A1QG4N21BF61PC", "A1R6AQHA5H0KHI", "A1RRP7BWZ3HS31",
# "A1SRI6ZFYJBEJK", "A1T453G4C9OPO5", "A1U20KMVGHTLDK", "A1UAJ6IW5YQ7F2",
# "A1V1760MG9YKRA", "A1YGSYTOGXCQY7", "A20F5O7H2XAXN5", "A26T345MD8F865",
# "A28OR0DDYOT4XB", "A29VL3MZE7YPBZ", "A2AYPPLTK9KDSY", "A2BPTKFPJ8WGY3",
# "A2BWY9JK2J0Q7D", "A2D6EHMWM8X5QJ", "A2DTF58XC4ELZJ", "A2F4NRTVDBNR6C",
# "A2G91477Y0YLIV", "A2JBAEXWD5U485", "A2L2OJ069EHLQB", "A2LJBCIP21N8CZ",
# "A2MREH5E2SDNVK", "A2OS0VCSQLU3HE", "A2PJQCHOGR7RTO", "A2QLSHXNCHBRN4",
# "A2SWBRY1NCRXHB", "A2TIKP7M8MG3BJ", "A2XMY32NV4NLI3", "A2YSDESUQFQ8V1",
# "A2Z5X8X76MCRIP", "A31RY07WJHLOGY", "A32X27Z851A4F3", "A33L61XKPX76DB",
# "A35ZEFM3Z7DHJ0", "A36BZCSINHP2R9", "A376R1Q5T76E9Z", "A37QZIPI5JW6Q9",
# "A39YEO8NL2RJ5Z", "A3A3OOI884K2LP", "A3F4XU9JPE277V", "A3FM4IDHKJ35WI",
# "A3IGM4FFDS1TN7", "A3JHNJ80US75BC", "A3JMW8FYE9LJIV", "A3KCT51PDCLUFD",
# "A3M17SH2HKDG8S", "A3MWSVO26MJI82", "A3O81LHBBI8NPK", "A3ODITRQ0WT495",
# "A3S0DQPMBLEX02", "A3SKYCRA18D6V3", "A3T76FLJSLZX9X", "A3U21K8PHW1ZIA",
# "A3UHHP4M8SI6OO", "A3UNAQJKJK0HOI", "A3VG5NECRUNLKI", "A40W0EWYGHNV0",
# "A49HPQ9P5AHU4", "A7BOOXBNIRFDR", "A8ZI8HDFJMEWJ", "A91OXJPTS9K30",
# "AAAZ98AAN3OHS", "AAE9H4ZIKQS37", "ACKM0WR39KYII", "AD3N1RN9TL4D0",
# "ADHGGPFJ9E2Y2", "AEHXJIW38LJS4", "AEJS0HEH4HSA7", "AEX9MA72M10DC",
# "AH5ONZ6X46KSI", "AHXE36JW3AY4J", "AIIR1E0U1VPVE", "AIQ0ETUSKWKJE",
# "AOIT11QP5Z83X", "APSWV9HI4MC3X", "AS1ODFT8BG63T", "AS8T4IKYL4V7F",
# "AWSXWPJJPYFMN", "AZNSALSVO9LTI")


# def broke_bonus():
#     for hit in hits:
#         assignments = get_answers(hit.HITId)
#         for assignment in assignments:
#             if assignment['workerId'] in bonus:
#                 pay_bonus(worker_id=assignment['workerId'], assign_id=assignment['assignmentId'], bonus_price=BONUS, reason="Congratulations, you got the Bonus Question correct!")
#                 mtc.grant_bonus(worker_id=assignment['workerId'], assignment_id=assignment['assignmentId'], bonus_price=Price(amount=BONUS), reason="Congratulations, you got the Bonus Question correct!")
nopay = ["A2YDKZI930GXVP", "A34ZSF2JSRXIRP", "A305X6KMRX5K8H", "A90H9WM0CBJCY",
"A3D1VTLX623K6I", "AYXIDCIGUA037", "A166A2M31CW2C7", "AEJS0HEH4HSA7",
"A16205WHC84L9U", "A32OV5YZIQD0HX", "A32OV5YZIQD0HX", "A20ZUIT7N61IDE",
"A1Y0ND7Z1AS2N8", "AOAJNPPUQSDB1", "A2OS0VCSQLU3HE", "A2SNRZG7PR1FWW",
"", "A27MJOV91GA8R3", "A2TEF5K1UBKZ2C", "A3UN57EC5AXY1Z", "A1T453G4C9OPO5",
"A1FCXXJL6PCZRC"]
