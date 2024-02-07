module.exports= function order(oldOrder){
    this.products = oldOrder.products || {};
    this.totalQty = oldOrder.totalQty || 0;
    this.totalPrice = oldOrder.totalPrice || 0;

    this.add = function(product, id) {
        const storedProduct = this.products[id];
        if(!storedProduct) {
            storedProduct = this.products[id] = {product: product, qty: 0, price: 0};
        }
        storedProduct.qty++;
        storedProduct.price = storedProduct.product.price * storedProduct.qty;
        this.totalQty++;
        this.totalPrice += storedProduct.product.price;
    }

    this.generateArray = function() {
        const arr = [];
        for(const id in this.products) {
            arr.push(this.products[id])
        }
        return arr;
    };
};