import store from '@/store/index'; 
<style lang="scss">
/* 注意要写在第一行，注意不能引入至uni.scss，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-plus/index.scss";
</style>
<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 检查登录状态
			const token = uni.getStorageSync('token')
			if (token) {
			    store.dispatch('user/checkTokenValidity');
			}
			if (!token) {
				// 如果没有登录，跳转到登录页面
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
