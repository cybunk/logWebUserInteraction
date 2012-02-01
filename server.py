import os,json,uuid,string
from flask import Flask
from flask import render_template,session,request,redirect,url_for,escape
import pymongo

# PARAMETRES  
# DB = DataBase
# COL= Collection 
DB   	  = 'uilog'
COL_init  = 'uilog_init'
COL_trail = 'uilog_trail'

connection = pymongo.Connection("localhost", 27017)
db 		   = connection[DB]
print db[COL_init]

app = Flask(__name__)

@app.route("/")
def index():
    if 'uuid' in session:
        #return 'Logged in as : %s' % escape(session['navigator'])
        #session['navigator']['id']="test";
        return session['init']['uuid']
    return 'You are not logged in'

@app.route("/i")
def i():
	f = open('test.html', 'r')
	return f.read()

@app.route('/login', methods = ['GET', 'POST'])
def login():
	if request.method == 'POST':
		if not 'init' in session:
				session['init'] = json.loads(request.form['init'])
				session['init']['id'] = str(uuid.uuid1())
				dictform = dict(session['init'])
				db[COL_init].save(dictform)
		else:
				print "session already exist"
				
		print session['init']['id']
		return redirect(url_for('index'))
		
	return '''ERROR'''


@app.route('/trail', methods=['GET', 'POST'])
def trail():
	if request.method == 'POST':
		mytrail 	  = json.loads(request.form['trail'])
		time		  = 0
		mouse		  = [0,0]
		for t in mytrail:			
			if 'e' in t:
				print "ici"
				print time
			else :
				t['t'] = t['t']+time
				t['m'][0] = mouse[0] +t['m'][0]
				t['m'][1] = mouse[1] +t['m'][1]
				t['e'] = 'onmousemove'
			time = t['t']
			mouse[0] = t['m'][0]
			mouse[1] = t['m'][1]
			t['id'] = session['init']['id'];
			dictform 	  = dict(t)
			db[COL_trail].save(dictform)
		return 'true'

@app.route('/logout')
def logout():
    session.pop('init', None)
    return redirect(url_for('index'))

# set the secret key.  keep this really secret:
app.secret_key = os.urandom(24)

if __name__ == "__main__":
	app.run(debug=True)