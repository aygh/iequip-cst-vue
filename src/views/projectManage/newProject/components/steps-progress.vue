<template>
    <div class="stepsProgress">
        <dl>
            <dt>
                <img src="@/assets/images/createNewProject/u543.png" alt="">
                <span>1</span>
            </dt>
            <dd>第一步</dd>
            <div class="progress-line"></div>
        </dl>
        <dl>
            <dt>
                <img src="@/assets/images/createNewProject/u547.png" alt="">
                <span>2</span>
            </dt>
            <dd>第二步</dd>
            <div class="progress-line"></div>
        </dl>
        <dl>
            <dt>
                <img src="@/assets/images/createNewProject/u547.png" alt="">
                <span>3</span>
            </dt>
            <dd>第三步</dd>
            <div class="progress-line"></div>
        </dl>
        <dl>
            <dt>
                <img src="@/assets/images/createNewProject/u547.png" alt="">
                <span>4</span>
            </dt>
            <dd>第四步</dd>
        </dl>
    </div>
</template>

<script>
export default {
    name: "stepsProgress"
}
</script>

<style lang="scss" scoped>
    .stepsProgress {
        width: 880px;
        display: flex;
        justify-content: space-between;
        margin: 50px auto 83px;
        dl {
            position: relative;
        dt {
            position: relative;
            span {
                position: absolute;
                left: 0;
                right: 0;
                top: 12px;
                color: #fff;
            }
        }
        dd {
            margin-inline-start: 0;
            margin-top: 10px;
        }
        .progress-line {
            width: 220px;
            height: 2px;
            background-color: #ccc;
            position: absolute;
            left: 50px;
            top: 20px;
        }
    }
    }
    
</style>

