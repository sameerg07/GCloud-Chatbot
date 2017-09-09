from urllib2 import Request, urlopen
# import requests as rq
values = """
  {
    "image": "https://i.imgur.com/ZjzVsq3.jpg",
    "subject_id": "sampics",
    "gallery_name": "samPics"
  }
"""

headers = {
  'Content-Type': 'application/json',
  'app_id': '39828e12',
  'app_key': '9fa4851021c0c06ba941a932b0408131'
}
request = Request('https://api.kairos.com/enroll', data=values, headers=headers)

response_body = urlopen(request).read()
print(response_body)