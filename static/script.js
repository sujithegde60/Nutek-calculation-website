var width, thk, length, load, bearing, FOS, cc, dia, moment, d, ratio,fy,fck,mu_lim,Ast;

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

            moment=((load+(width*thk*length*2.5*Math.pow(10, -9)))*10*FOS*(width-bearing))/4000
            
            d=thk-cc-(dia/2)

            ratio=(moment*1000000)/(1000*Math.pow(d,2));


            if(isNaN(ratio)){return;}

            if(ratio>6)
            {
                document.getElementById('warning').style.visibility='visible';
                document.getElementById('warning').textContent="Mu/bd² is "+ratio.toFixed(1)+", Increase thickness";

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
 
    function calc_ast()
    
    {
        var xumax=xumaxlookup[fy]*d;
        
        mu_lim=(0.36*(xumax/d)*(1-(0.42*(xumax/d)))*length*Math.pow(d,2)*fck)/1000000;
        
        if(mu<=mu_lim) //singly reinforced
        {
            var a=0.1512*fck*1000;
            var b=-0.36*1000*fck*d;
            var c=moment*1000000;
            var xu=0;

            var discriminant = b * b - 4 * a * c;

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

                document.getElementById('warning').style.visibility='visible';
                document.getElementById('warning').textContent=Ast;
            }
            else
            {
                return "error";
            }


        }

        else //doubly reinforced

        {

        }


    }

    function multiple()
    {
    check_depth() ;
    calc_ast();

    }
