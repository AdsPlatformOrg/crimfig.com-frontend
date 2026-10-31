// Git may check out CRLF on Windows. Contract provenance hashes canonical LF text,
// while semantic/code differences must still fail drift comparison.
export const contractText=value=>value.replace(/\r\n/g,'\n');
export const sameContractText=(actual,expected)=>contractText(actual)===contractText(expected);
