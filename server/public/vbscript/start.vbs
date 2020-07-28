Set objArgs = WScript. Arguments
if  objArgs.count=0 then
    msgbox "error"
elseif objargs.count=1 then

	set ws=createobject("wscript.shell")
	ws.run objargs(0)
	
end if

