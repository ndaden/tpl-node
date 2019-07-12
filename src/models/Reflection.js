import moment from 'moment';

class Reflection {
    constructor(){
        this.reflections = [];
    }

    create(data){
        const newReflection = {
            id: '1',
            success: data.success || '',
            lowPoint: data.lowPoint || '',
            takeAway: data.takeAway || '',
            createDate: moment.now(),
            modifiedDate: moment.now()
        };

        this.reflections.push(newReflection);
        return newReflection;
    }

    findAll(){
        return this.reflections;
    }

    findOne(id){
        return this.reflections.find(reflect => reflect.id == id);
    }

    delete(id){
        const reflection = this.findOne(id);
        const index = this.reflections.indexOf(reflection);
        this.reflections.splice(index, 1);
        return {};
    }

}

export default new Reflection();