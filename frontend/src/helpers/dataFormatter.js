import dayjs from 'dayjs';

export default {
    filesFormatter(arr) {
        if (!arr || !arr.length) return []
        return arr.map(item => ({
            name: item.name,
            publicUrl: item.publicUrl || ''
        }))
    },
    imageFormatter(arr) {
        if (!arr || !arr.length) return []
        return arr.map(item => ({
            publicUrl: item.publicUrl || ''
        }))
    },
    oneImageFormatter(arr) {
        if (!arr || !arr.length) return ''
        return arr[0].publicUrl || ''
    },
    dateFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD')
    },
    dateTimeFormatter(date) {
        if (!date) return ''
        return dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    booleanFormatter(val) {
        return val ? 'Yes' : 'No'
    },

        usersManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map(item => item.firstName)
        },
        usersOneListFormatter(val) {
            if (!val) return ''
            return val.firstName
        },
        usersManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.firstName}
            });
        },
        usersOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.firstName, id: val.id}
        },

        tagsManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map(item => item.name)
        },
        tagsOneListFormatter(val) {
            if (!val) return ''
            return val.name
        },
        tagsManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.name}
            });
        },
        tagsOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.name, id: val.id}
        },

        articlesManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map(item => item.title)
        },
        articlesOneListFormatter(val) {
            if (!val) return ''
            return val.title
        },
        articlesManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.title}
            });
        },
        articlesOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.title, id: val.id}
        },

        categoriesManyListFormatter(val) {
            if (!val || !val.length) return []
            return val.map(item => item.name)
        },
        categoriesOneListFormatter(val) {
            if (!val) return ''
            return val.name
        },
        categoriesManyListFormatterEdit(val) {
            if (!val || !val.length) return []
            return val.map((item) => {
              return {id: item.id, label: item.name}
            });
        },
        categoriesOneListFormatterEdit(val) {
            if (!val) return ''
            return {label: val.name, id: val.id}
        },

}
