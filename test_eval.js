var fso = new ActiveXObject("Scripting.FileSystemObject");
var f = fso.OpenTextFile("data.js", 1);
var content = f.ReadAll();
f.Close();

try {
    eval(content);
    WScript.Echo("EVAL SUCCESS");
    WScript.Echo("Keys: " + typeof window.PAGE_DATA);
} catch(e) {
    WScript.Echo("EVAL ERROR: " + e.message + " at line: " + e.line);
}
