// @testable
class User {
    constructor(props) {
        this.props = props;
    }
    getProps() {
        console.log(this.props)
    }
}
// function testable(target) {
//     target.isTestable = true;
// }
const man = new User('hahah')
man.getProps()
console.log(User.isTestable)
