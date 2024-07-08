<template>
  <div class="common-layout">

    <div class="index-container" style="font-size: 24px;">
      <p >欢迎访问饮酒令后台!</p>
    </div>
  
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import { noticeListApi } from "@/utils/request.ts";
import  defaultImageUrl from "@/assets/images/blank.png";

const loading = ref(false);
const username = ref("你好");
const data = reactive({
  searchParams: {
    keyword: "",
    current_page: 1,
    per_page_size: 10,
  },
  total_items: 0,
  list: [],
})
let headTitle = ref("");
let headDesc = ref("");

const small = ref(false)
const background = ref(false)
const disabled = ref(false)

console.log('data searchParams:', data.searchParams);


const handleError = (item) => {
      item.image_url = (defaultImageUrl);
    };


const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
  data.searchParams.per_page_size = val;

 // searchList();
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  data.searchParams.current_page = val;
 // searchList();
}

const search = () => {
  //data.searchParams.keyword = keyword;
  console.log('search searchParams:', data.searchParams);
  data.searchParams.current_page = 1;
 // searchList();
}

//请求接口
const searchList = () => {
  // 请求后台接口
  noticeListApi(data.searchParams).then((res) => {
    console.log(res);
    let resData = res;
    if (resData) {

      if (resData.total_items) {
        data.total_items = resData.total_items;
      }
      data.list = resData.announcements;
      // data.list = resData.announcements.map(item => {
      //   return {...item,image_url:'https://img.zcool.cn/community/01a3865ab91314a8012062e3c38ff6.png@1280w_1l_2o_100sh.png'};
      // });

      headTitle.value = resData.greeting.title;
      headDesc.value = resData.greeting.content;

      // 使用sort()方法进行降序排序
      data.list.sort((a, b) => {
        let at = Date.parse(a.timestamp);
        let bt = (b.timestamp);

        // 使用字符串比较来进行排序
        if (at > bt) {
          return -1; // 将a排在b的前面
        } else if (at < bt) {
          return 1; // 将a排在b的后面
        } else {
          return 0; // 保持原顺序
        }
      });

      // 分页情况
    }
  });
};


onMounted(async () => {

  console.log('onMounted');
  try {
    loading.value = true;
   // searchList();

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

</script>

<style scoped>
.main-list {
  margin-top: 0px;
  padding-top: 0px;
}


/* .el-table__row {
    background-color: var(--el-table-tr-bg-color);
    height: 65px !important;
} */

/* 分页 */
.demo-pagination-block {
  margin-top: 35px;
  margin-bottom: 35px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}


.index-container {
  margin-left: 10px;
  margin-top: 15px;
  display: flex;
  align-items: center;
}

.index-avatar {
  margin-right: 10px;

}

.index-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px;
}

.index-short-text {
  font-size: 18px;
  font-weight: bold;
  text-align: left;
}

.index-description {
  font-size: 14px;
  color: #555;
  text-align: left;
}



.item-container {
  display: flex;
  align-items: center;
}

.item-avatar {
  margin-right: 10px;

}

.item-avatar img {
  width: 50px;
  height: 50px;
  /* border-radius: 50%; */
  margin: 10px;
}

.item-short-text {
  font-size: 18px;
  font-weight: bold;
  text-align: left;
}

.item-description {
  font-size: 14px;
  color: #555;
  text-align: left;
}
</style>
