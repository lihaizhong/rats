## DOMEval.js

>     function DOMEval(code, doc) {
>         doc = doc || document;
>         
>         var script = doc.createElement('script');
>         
>         script.text = code;
>         
>         doc.head.appendChild( script ).parentNode.removeChild( script );
>     }

### 引用
+ ../var/document.js