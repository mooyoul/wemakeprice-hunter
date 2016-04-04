# wemakeprice-hunter
위메프 만우절 이벤트 Slack 알림 Integration


## Introduction
이 스크립트는 위메프에서 2016년 만우절 이벤트로 진행한 [만우절 가격 실수](http://www.wemakeprice.com/search?search_cate=top&search_keyword=%EB%A7%8C%EC%9A%B0%EC%A0%88%EA%B0%80%EA%B2%A9%EC%8B%A4%EC%88%98&_service=5&_type=3)의 행사 대상 품목의 재고를 주기적으로 파악하여 Slack으로 알림을 보내는 스크립트입니다.
만우절 가격 실수 이벤트의 자세한 정보는 [해당 이벤트 기사](http://news.naver.com/main/read.nhn?mode=LSD&mid=sec&sid1=101&oid=030&aid=0002465060)를 참고하세요.


## How it works
![상품 상세페이지 옵션](https://raw.githubusercontent.com/mooyoul/wemakeprice-hunter/master/images/option.png)
해당 이벤트는 위 이미지와 같이 상품 상세페이지의 상품 옵션에 '만우절 가격실수'라는 별도 옵션을 두어 특정 시간대에 게릴라로 해당 옵션의 재고를 조절하여 판매하는 방식으로 이루어졌습니다.

요즘에는 REST API 하나로 데스크탑 웹과 모바일 웹, 그리고 모바일 앱을 모두 커버하는 추세이고,
또한 대부분의 쇼핑몰에서는 상품 재고 현황을 실시간으로 갱신하거나 새로고침 없이 갱신하기 위해 Ajax call을 통해 REST API를 호출하는 것이 일반적이기 때문에 위메프에도 옵션을 받기 위한 별도 REST API가 존재할 것이라 예상했습니다.

![Option API Request](https://raw.githubusercontent.com/mooyoul/wemakeprice-hunter/master/images/api_request.png)
네 빙고. 예감이 적중했던 걸 확인할 수 있습니다.
옵션을 받아오는 API Endpoint는 `http://www.wemakeprice.com/c/deal_option/get_option_info/${PRODUCT_ID}`으로, 상품 ID가 path parameter로 붙는걸 확인할 수 있었습니다.

그럼, API Response Payload를 뜯어볼까요?
![Option API Response](https://raw.githubusercontent.com/mooyoul/wemakeprice-hunter/master/images/api_response.png)
예스, 남은 재고와 몇개 팔렸는지 판매량까지 모두 획득할 수 있네요.
현재는 해당 이벤트가 종료되었지만, 해당 이벤트로 저 프린터를 사간 사람이 5명이나 있었다는 사실도 알 수 있습니다 흐흐.

API를 뜯어봤으니, 주기적으로 이걸 풀링해서 만우절 이벤트 옵션의 재고가 1개 이상이면 알림을 보내면 되겠죠?
자세한 것을 알아보고 싶으시다면, [스크립트](app.js)를 참고해보세요 :)

아... 그러고보니 여러분이 제일 궁금해하시는 사항을 빼먹었네요.
그래서 이거 돌려서 득템했냐고요? 아뇨. 못했습니다. 오전에 스마트폰에서 확인했을때는 로그인하다가 다른 분이 사가셨고,
오후에는 단 한번도 알림이 울린 적이 없습니다. 안될 사람은 안됩니다.... 크흑 ㅠㅠ


## Requirements
저는 자바스크립트를 졸라 사랑하는 사람이니까 Node.js로 스크립트를 짰습니다. *자바스크립트 짱짱맨!*
ES6의 const declaration과 arrow function을 사용하기 때문에 Node.js 4 이상 혹은 iojs를 사용하셔야합니다.


## Getting Started
```bash
$ git clone https://github.com/mooyoul/wemakeprice-hunter.git
$ cd wemakeprice-hunter
$ npm install
$ # app.js를 열어서 최상단 SLACK_USERNAME, SLACK_INCOMING_WEBHOOK_ENDPOINT,
$ # FETCH_TARGETS, FETCH_INTERVAL를 원하는 값으로 변경하세요.
$ vim app.js
$ node app.js
```


## Disclaimer
본 스크립트를 사용함에 있어 발생하는 모든 책임은 해당 사용자에게 있습니다.


## License
[MIT](LICENSE)

See full license on [mooyoul.mit-license.org](http://mooyoul.mit-license.org/)