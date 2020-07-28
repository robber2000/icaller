Set objArgs = WScript. Arguments
if  objArgs.count=0 then
    msgbox "error"
elseif objargs.count=1 then
                on error resume next
	set objTTS = CreateObject("sapi.spvoice")
	objTTS.speak( objargs(0)+"«Î»°“©")
	
end if