
Set objArgs = WScript. Arguments
if  objArgs.count=0 then
    msgbox "error"
elseif objargs.count=1 then
    'on error resume next
	'set objTTS = CreateObject("sapi.spvoice")
	'objTTS.speak( objargs(0)+"«Î»°“©")
	Set objVoice = CreateObject("SAPI.SpVoice")
	Set colVoice = objVoice.GetVoices()
	objVoice.Volume = 100 
	objVoice.Rate = -2

	langCN = "MSSimplifiedChineseVoice"
	langEN = "MSSam" 
	For i = 0 To colVoice.count
	'msgbox colVoice(i).Id
	'msgbox i

	Next

	Const SSFMCreateForWrite = 3
	Const SAFT22kHz16BitMono = 22
	Const SVSFlagsAsync = 1
	cnVoice =0
	Set objVoice.Voice = colVoice.Item(cnVoice)


	Set objFileStream = CreateObject("SAPI.SpFileStream")
	objFileStream.Format.Type = SAFT22kHz16BitMono
	objFileStream.Open "d:\\icaller\\caller.wav", SSFMCreateForWrite, False
	Set objVoice.AudioOutputStream = objFileStream
	'objVoice.volume=200
	objVoice.Speak  objargs(0)+"«Î»°“©", SVSFlagsAsync
	objVoice.WaitUntilDone -1
	objFileStream.Close
	
	set ws=createobject("wscript.shell")
	ws.run "d:\\icaller\\caller.wav"
	
end if

'on error resume next

