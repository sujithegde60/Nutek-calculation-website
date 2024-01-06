from flask import Flask,render_template,request
app=Flask(__name__)

@app.route('/')

def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    # Retrieve form data
    width = int(request.form['width'])
    length = int(request.form['length'])
    thickness = int(request.form['thk'])
    load = float(request.form['load'])
    clear_cover = float(request.form['CC'])
    bearing = float(request.form['Bearing'])
    fos = float(request.form['FOS'])
    fy = float(request.form['fy'])
    fck = float(request.form['fck'])

    #Reinforcement
    try:
        dia_bot_width=int(request.form['dia_bottom_width'])
        dia_bot_length=int(request.form['dia_bottom_length'])
        spacing_bot_width=float(request.form['spacing_bottom_width'])
        spacing_bot_length=float(request.form['spacing_bottom_length'])

        dia_bot_width=int(request.form['dia_top_width'])
        dia_bot_length=int(request.form['dia_top_length'])
        spacing_bot_width=float(request.form['spacing_top_width'])
        spacing_bot_length=float(request.form['spacing_top_length'])
    except ValueError:
        print("error")

    volume=(width*length*thickness)/10**9
    weight=volume*2500


    result=f"{width} X {length} X {thickness} mm \n volume: {volume} m³ weight:{weight} kg \n Load {load} MT \n Reinforcement "

    return render_template('index.html',result=result,width=width,length=length,thickness=thickness,load=load,CC=clear_cover,Bearing=bearing,FOS=fos,fy=fy,fck=fck)


if __name__=='__main__':
    app.run(debug=True)