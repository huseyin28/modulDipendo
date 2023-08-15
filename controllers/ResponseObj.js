class ResponseObj {
    constructor() {
        this.success = false
    }

    setError(error) {
        this.success = false
        this.message = "İşlem başarısız daha sonra tekrar deneyin"
        this.error = error
    }

    setData(data) {
        this.success = true
        this.data = data
    }
}

module.exports = ResponseObj