import json
import re

f = open("generics-simpler.results", "r")
w = open("question-generics.results", "w")
w.write("\t".join(["subj", #"comments",
	               #"age", "language",
	               "training", "target", #"domain", "property",
	               "qNum", "response"]))#, "lowers", "uppers", "nPositiveExamples"]))
w.close()
w = open("question-generics.results", "a")
header = []

sep = "\t"

subjNums = {}
def subjNum(elem):
	if not elem in subjNums.keys():
		subjNums[elem] = str(len(subjNums))
	else:
		print "repeat"
	return subjNums[elem]

def cutFirstAndLast(x, i=1, j=1):
	return x[i:(len(x)-j)]

def tameQuotes(x):
	return re.sub("\"+", "\"", x)

firstLine = True
for line in f:
	row = line[:-1].split(sep)

	# data per subject:
	subj = ""
	training = ""
	target = ""
	domain = ""
	response = ""

	# get subj data from csv:
	if firstLine:
		header = map(cutFirstAndLast, row)
		firstLine = False
	else:
		for i in range(len(row)):
			heading = header[i]
			elem = row[i]
			if heading == "workerid":
				subj = subjNum(elem) #SUBJECT NUMBER
			elif heading in map(lambda x: "Answer.trial"+str(x), range(0,20)) and len(elem)>0:
				qNum = heading.split("trial")[1] #QUESTION NUMBER (ORDERING)
				qData = json.loads(tameQuotes(cutFirstAndLast(elem)))
				qType = qData["qType"]
				if qType == "target":
					cond = qData["condition"]
					if len(cond) == 3:
						training = cond[1]
						target = cond[2]
						response = str(qData["responses"][0])
						w.write("\n" + "\t".join([subj, training, target, qNum, response]))
f.close()
w.close()
