import json
import re

f1 = open("generics.results", "r")
f2 = open("generics-erin.results", "r")
f3 = open("generics-erin2.results", "r")
f4 = open("generics-simpler-erin.results", "r")
f5 = open("generics-simpler.results", "r")
w = open("generics-12-17.results", "w")
w.write("\t".join(["subj", "distribution", "utteranceType", "response"]))
w.close()
w = open("generics-12-17.results", "a")
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

for f in [f1, f2, f3, f4]:
	firstLine = True
	for line in f:
		row = line[:-1].split(sep)

		# data per subject:
		subj = ""

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
	f.close()

firstLine = True
for line in f5:
	row = line[:-1].split(sep)

	# data per subject:
	subj = ""
	distribution = ""
	utteranceType = ""
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
				qData = json.loads(tameQuotes(cutFirstAndLast(elem)))
				qType = qData["qType"]
				if qType == "target":
					response = str(qData["responses"][0])
					utteranceType = qData["utteranceType"]
					distribution = qData["distribution"]
					w.write("\n" + subj + "\t" + distribution + "\t" + utteranceType + "\t" + response)
f5.close()
w.close()
