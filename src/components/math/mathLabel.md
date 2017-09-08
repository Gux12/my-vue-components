## 公式标注API
### task
**获取几个任务：**/api/v2/daily/dataset/task?dataset_id=4
/api/v2/daily/dataset/task
**标注一条数据：**dataset/task  POST  {cost:用时毫秒,data:{text:原始文本,label_text:标注文本},dataset_id:4,id,time:第几次标注}  
**删除一条数据：**dataset/delete  POST  {cost, id, time}  

###simstring
**数学：**/api/v2/daily/lint/math   
{query}
**化学**/api/v2/daily/lint/chem

## 公式标注方法
`click` 选中单个数据
`cmd`+`click` 选中多个数据
`shift`+`click` 选中两数据块之间数据
`cmd`+`a` 全选
`alt`+`a` 全不选
`cmd`+`d` 删除选中
`enter` 提交 

