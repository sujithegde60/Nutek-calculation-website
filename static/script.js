var width, thk, length, load, bearing, FOS, cc, dia, moment, d, ratio,fy,fck,mu_lim,Ast,beff,dia_top_width,Asc,volume;

        function submitform()
        {
            var form = document.getElementById('inputs');
        
        // Submit the form
        form.submit();

        return false;  
        }
   
        function check_depth()
        {
             width=parseFloat(document.getElementById('width').value);
             thk=parseFloat(document.getElementById('thk').value);
             length=parseFloat(document.getElementById('length').value);
             load=parseFloat(document.getElementById('load').value);
             bearing=parseFloat(document.getElementById('bearing').value);
             FOS=parseFloat(document.getElementById('FOS').value);
             cc=parseFloat(document.getElementById('CC').value);
             dia=parseInt(document.getElementById('dia_bottom_width').value);
             fy=parseInt(document.getElementById('fy').value);
             fck=parseInt(document.getElementById('fck').value);
             volume=width*length*thk/1000000000

            moment=Math.max((((load+(width*thk*length*2.5*Math.pow(10, -9)))*10*FOS*(width-bearing))/4000),0)
            
            d=thk-cc-(dia/2)
            beff=Math.min(length,300+(2.4*(width/2)*0.5)); //reference AS3600:2018 cl 9.6, assuming the laod is at midspan
            
            ratio=(moment*1000000)/(1000*Math.pow(d,2));

            if(isNaN(ratio)){return;}

            if(ratio>6)
            {
                warning("Mu/bd² is "+ratio.toFixed(1)+", Increase thickness")

            }
            else
            {
                document.getElementById('warning').style.visibility='hidden';
                
            }
            
        }

        var xumaxlookup = {
            250: 0.53,
            415: 0.48,
            500: 0.46,
            550: 0.46
        };
        var rebararea={
            8:50.26,
            10:78.53,
            12:113.09,
            16:201.06,
            20:314.159
        };
document.addEventListener('DOMContentLoaded',function(){
    var warningElement = document.getElementById('warning');
    if (warningElement) {
    document.getElementById('inputs').addEventListener('input',function (event)
    {
        if(event.target.id!=='spacing_bottom_width' && event.target.id!=='spacing_bottom_length' && event.target.id!=='spacing_top_width' && event.target.id!=='spacing_top_length')
            {   
                multiple();
            }
    });}
    else{
        console.error("Element with ID 'warning' not found.")
    }
});
    
    function calc_ast()
    {
        var xumax=xumaxlookup[fy]*d;
        
        mu_lim=(0.36*(xumax/d)*(1-(0.42*(xumax/d)))*beff*Math.pow(d,2)*fck)/1000000;
        
        if(moment<=mu_lim) //singly reinforced
        {
            console.log("b "+beff)
            var a=0.1512*fck*beff;
            var b=-0.36*beff*fck*d;
            var c=moment*1000000;
            var xu=0;
            Asc=0;
            var discriminant = b * b - 4 * a * c;
            console.log("discriminant"+discriminant)
            // Check if the discriminant is non-negative
            if (discriminant >= 0) 
            {
                // Calculate the two solutions using the quadratic formula
                var solution1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                var solution2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                
                if(solution1<0 && solution2 <0)
                {
                    return;
                }
                
                xu=Math.min(solution1,solution2);

                if(xu<0)
                {   
                    xu=Math.max(solution1,solution2)

                }
                
                Ast=0.36*fck*xu*length/(0.87*fy)

                console.log("Ast ",Ast)

                
                //calcualte spacing of main rebar dia
                if(Ast!=0)
                {
                    var ast=rebararea[dia];
                    var spacing=(ast/Ast)*beff;

                    spacing=Math.round(spacing / 5) * 5;

                    document.getElementById("spacing_bottom_width").value=Math.min(spacing,200)

                }
                else
                {
                    document.getElementById("spacing_bottom_width").value=200
                }

                if(thk>=100)
                {
                  if(document.getElementById("dia_top_width").value==0)
                  {
                    document.getElementById("dia_top_width").value='8'
                    document.getElementById("dia_top_length").value='8'
   
                    document.getElementById("spacing_top_width").value=200
                    document.getElementById("spacing_top_length").value=200
                  }
                }
                else
                {
                    document.getElementById("dia_top_width").value='0'
                    document.getElementById("dia_top_length").value='0'
                }

              
            }
            else
            { 
                console.log("error")
                
            }


        }

        else //doubly reinforced

        {
            console.log("Doubly reinforced")

            if(document.getElementById("dia_top_width").value=='0')
            {
                document.getElementById("dia_top_width").value='8'
            }
            dia_top_width=document.getElementById("dia_top_width").value
            

            var fsc=(0.0035*(xumax-cc)/xumax)*0.66*210000;
            console.log("fsc"+fsc)
            console.log("moment-mu_lim "+moment+"-"+mu_lim)
            Asc=((moment-mu_lim)*1000000)/(fsc*(d-(cc+(dia_top_width/2))));

            console.log("Asc "+Asc)

            var Ast1=0.36*xumax*beff*fck/(0.87*fy);

            console.log("Ast2= "+Asc+"*"+fsc+"/"+0.87+"*"+fy)

            var Ast2=Asc*fsc/(0.87*fy);

            console.log("Ast2"+Ast2)
            Ast=Ast1+Ast2;

            //calcualte spacing of main rebar dia
            if(Ast!=0)
            {
                var ast=rebararea[dia];
                var spacing=(ast/Ast)*beff;
                spacing=Math.round(spacing / 5) * 5;

                document.getElementById("spacing_bottom_width").value=Math.min(spacing,200)
            }
            else
            {
                document.getElementById("spacing_bottom_width").value=200
            }
            if(Asc!=0)
            {
                var ast=rebararea[dia_top_width];
                var spacing=(ast/Asc)*beff;
                spacing=Math.round(spacing / 5) * 5;

                document.getElementById("spacing_top_width").value=Math.min(spacing,200)
            }
            else
            {
                document.getElementById("spacing_top_width").value=200
            }
        
            
        }


    }
    function calc_steel()
    {
        var msflat=(length*2+width*2)*thk*1.6*7850/1000000000;

        var bot_width_dia=document.getElementById("dia_bottom_width").value;
        var bot_width_spac=document.getElementById("spacing_bottom_width").value;

        var bot_length_dia=document.getElementById("dia_bottom_length").value;
        var bot_length_spac=document.getElementById("spacing_bottom_length").value;
        
        var top_width_dia=document.getElementById("dia_top_width").value;
        var top_width_spac=document.getElementById("spacing_top_width").value;

        var top_length_dia=document.getElementById("dia_top_length").value;
        var top_length_spac=document.getElementById("spacing_top_length").value;

        //Bottom rebar- main
        var bot_no_along_length = Math.ceil(length / bot_width_spac) + 1;
        var bot_main_tmt=(bot_no_along_length*rebararea[bot_width_dia]*(width+thk))*7850/1000000000;

        //Bottom rebar- secondary
        var bot_no_along_width = Math.ceil(width / bot_length_spac) + 1;
        var bot_sec_tmt=(bot_no_along_width*rebararea[bot_length_dia]*(length+thk))*7850/1000000000;

        var top_main_tmt=0;
        var top_sec_tmt=0;

        if(top_width_dia!=0)
        {
           
        //Top rebar- main
        var top_no_along_length = Math.ceil(length / top_width_spac) + 1;
        top_main_tmt=(top_no_along_length*rebararea[top_width_dia]*(width+thk))*7850/1000000000;
        
        //Top rebar- secondary
        var top_no_along_width = Math.ceil(width / top_length_spac) + 1;
        top_sec_tmt=(top_no_along_width*rebararea[top_length_dia]*(length+thk))*7850/1000000000;

        }

        var tot_tmt=((bot_main_tmt+bot_sec_tmt+top_main_tmt+top_sec_tmt)*1.05+0.444).toFixed(1) ///0.444 is for handles. 1.05 is for wastage

        var output_msg = document.getElementById('output_info').textContent;

        show_info("Mu="+moment.toFixed(0)+" kn-m"+", Mu_lim="+mu_lim.toFixed(0)+" kn-m"+", Ast="+Ast.toFixed(0)+"mm²"+ ", Asc="+Asc.toFixed(0)+" mm²"+", Total tmt weight="+ tot_tmt+ " kg" + ", msflat="+msflat.toFixed(1)+" kg")
    
        var outputtext=document.getElementById("outputtext")

        if(top_width_dia!=0)
        {
            outputtext.textContent=width+"x"+length+"x"+thk+"\n"+"Volume "+volume+" m³"+"\n"+ "Weight "+(volume*2500)+" kg" +"\n"+
            "Load "+load+" Tonnes"+"\n\n" +
            "Bottom steel: "+"\n"+
            "T"+bot_width_dia+" @ "+ bot_width_spac+" ("+bot_no_along_length+"#- "+width+" mm length)"+"\n"+
            "T"+bot_length_dia+" @ "+ bot_length_spac+" ("+bot_no_along_width+"#- "+length+" mm length)"+"\n\n"+
            "Top steel: "+"\n"+
            "T"+top_width_dia+" @ "+ top_width_spac+" ("+top_no_along_length+"#- "+width+" mm length)"+"\n"+
            "T"+top_length_dia+" @ "+ top_length_spac+" ("+top_no_along_width+"#- "+length+" mm length)"+"\n\n"+
            "TMT Weight "+tot_tmt+" kg"+"\n"+
            "MS Flat "+msflat +" kg"

        }
        else
        {
                outputtext.textContent=width+"x"+length+"x"+thk+"\n"+"Volume "+volume+" m³"+"\n"+ "Weight "+(volume*2500)+" kg" +"\n"+
            "Load "+load+" Tonnes"+"\n\n"+
            "Bottom steel: "+"\n"+
            "T"+bot_width_dia+" @ "+ bot_width_spac+" ("+bot_no_along_length+"#- "+width+" mm length)"+"\n"+
            "T"+bot_length_dia+" @ "+ bot_length_spac+" ("+bot_no_along_width+"#- "+length+" mm length)"+"\n\n"+
            "TMT Weight "+tot_tmt+" kg"+"\n"+
            "MS Flat "+msflat +" kg"

        }

    }

    function multiple()
    {
        check_depth() ;
        calc_ast();
        calc_steel();
    }

function warning(msg)
{

    var warningElement = document.getElementById('warning');
    
    if (warningElement) {
        warningElement.style.visibility = 'visible';
        warningElement.textContent = msg;
    } 
    else {
        console.error("Element with ID 'warning' not found.");
    }

}

function show_info(msg)

{
    var output_element = document.getElementById('output_info');
   
    if(output_element)
    {
        output_element.style.visibility = 'visible';
        output_element.textContent = msg; 
    }
}
function clipboard()
{
    var output_element = document.getElementById('outputtext');
    var textToCopy = output_element.textContent;
    var textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);



}