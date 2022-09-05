

export const ChannelsApi = (instance) => ({
    async getChannels() {
        return instance.get('/auth/user/channels')
    },

    async getMarks() {
        return instance.get('/auth/user/channels/get-marks')
    },

    async saveMarks(marks) {
        return instance.post('/auth/user/channels/save-marks', marks)
    },

    async addChannel(formData) {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return instance.post('/auth/user/channels/add', formData, config);
    },

    async launchChannel(id) {
        return instance.get(`/auth/user/channels/${id}/launch`)
    },

    async updateChannel(id, channel_id, api_key) {
        return instance.post(`/auth/user/channels/${id}/update`, {channel_id: channel_id, api_key: api_key})
    },

    async deleteChannel(id, channel_id) {
        return instance.post(`/auth/user/channels/${id}/delete`, {channel_id: channel_id})
    },

    async editChannel(id, comment, count_commented_videos) {
        return instance.post(`/auth/user/channels/${id}/edit-channel`, {comment: comment, count_commented_videos: Number(count_commented_videos)})
    },

    async editProxy(id, proxy) {
        return instance.post(`/auth/user/channels/${id}/edit-proxy`, {proxy: proxy})
    },
})