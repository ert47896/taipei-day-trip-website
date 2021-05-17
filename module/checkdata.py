import re

def checkData(email, password, name=None):
    nameRule=r"^\S{1,60}$"
    emailRule=r"@"
    passwordRule=r"^\S{4,16}$"
    if name == None:
        nameResult=True
    else:
        nameResult=re.fullmatch(nameRule, name)
    emailResult=re.search(emailRule, email)
    passwordResult=re.search(passwordRule, password)
    return ((nameResult != None) and (emailResult != None) and (passwordResult != None))