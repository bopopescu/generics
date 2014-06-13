import json
import re

f1 = open("generics.results", "r")
f2 = open("generics-erin.results", "r")
f3 = open("generics-erin2.results", "r")
f4 = open("generics-simpler-erin.results", "r")
f5 = open("generics-simpler.results", "r")
w = open("generics1.results", "w")
w.write("\t".join(["subj", "distribution", "utteranceType", "response", "qNum"]))
w.close()
w = open("generics1.results", "a")
header = []

sep = "\t"

subjNums = {}
def subjNum(elem):
	if not elem in subjNums.keys():
		subjNums[elem] = str(len(subjNums))
		return subjNums[elem]
	else:
		print "repeat"
		return "repeat"

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
			elif heading == "Answer.targets":
				if (len(elem) > 0):
					qDatas = json.loads(tameQuotes(cutFirstAndLast(elem)))
					if (len(qDatas) == 6):
						for i in range(len(qDatas)):
							qData = qDatas[i]
							response = str(qData["response"])
							utteranceType = qData["utterance"]
							distribution = qData["distribution"]
							w.write("\n" + subj + "\t" + distribution + "\t" + utteranceType + "\t" + response + "\t" + str(i))
f5.close()
w.close()
