from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json,re,uuid
class Handler(BaseHTTPRequestHandler):
    def _reply(self,status,data):
        payload=json.dumps(data).encode();self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Access-Control-Allow-Origin','http://localhost:5173');self.send_header('Access-Control-Allow-Headers','Content-Type');self.send_header('Access-Control-Allow-Methods','POST, OPTIONS, GET');self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload)
    def do_OPTIONS(self):self._reply(200,{'ok':True})
    def do_GET(self):
        if self.path=='/health':return self._reply(200,{'status':'ok','service':'registration'})
        self._reply(404,{'error':'not_found'})
    def do_POST(self):
        if self.path!='/api/register':return self._reply(404,{'error':'not_found'})
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 1<=size<=4096:return self._reply(413,{'error':'request_size'})
            data=json.loads(self.rfile.read(size))
            if not isinstance(data,dict):raise ValueError('object required')
        except (ValueError,json.JSONDecodeError):return self._reply(400,{'error':'invalid_json'})
        name=data.get('fullName');email=data.get('email');program=data.get('program');consent=data.get('consent')
        permitted={'Quality Fundamentals','Production Operations','Industrial Data Essentials'}
        if not isinstance(name,str) or not 2<=len(name.strip())<=100 or not isinstance(email,str) or not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+',email) or program not in permitted or consent is not True:return self._reply(422,{'error':'invalid_fields'})
        # No personal profile data stored by this local receiver.
        return self._reply(201,{'status':'received','requestId':uuid.uuid4().hex[:12],'message':'Thanks for your interest. Your request has been recorded.'})
if __name__=='__main__':
    print('Registration receiver: http://localhost:8765');ThreadingHTTPServer(('127.0.0.1',8765),Handler).serve_forever()
