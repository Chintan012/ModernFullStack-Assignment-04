class ProductList extends React.Component {
    constructor() {
        super();
        this.state = { myProducts: [] };
        this.createProduct = this.createProduct.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
        productList {
          product_category product_name product_price product_image
        }
      }`;

        fetch(window.ENV.UI_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(response => {
            response.json().then(result => {
                this.setState({ myProducts: result.data.productList });
            });
        }).catch(err => {
            alert("Error in sending data to server: " + err.message);
        });
    }

    createProduct(myProduct) {
        const query = `mutation productAdd($myProduct: InventoryInputs!) {
    productAdd(product: $myProduct) {
      _id
    }
  }`;
        fetch(window.ENV.UI_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { myProduct } })
        }).then(response => {
            this.loadData();
        }).catch(err => {
            alert("Error in sending data to server: " + err.message);
        });
    }

    render() {
        return React.createElement(
            'div',
            { title: 'Inner Div' },
            React.createElement(
                'h1',
                { className: 'headerClass' },
                ' My Company Inventory '
            ),
            React.createElement(
                'h2',
                { className: 'headerClass' },
                ' Showing all available products '
            ),
            React.createElement('hr', null),
            React.createElement(ProductTable, { myProducts: this.state.myProducts }),
            React.createElement(
                'h2',
                null,
                'Add a new product to the inventory'
            ),
            React.createElement('hr', null),
            React.createElement(ProductAdd, { createProduct: this.createProduct })
        );
    }
}

function ProductTable({ myProducts }) {
    const productRows = myProducts.map(product => React.createElement(ProductRow, { key: product.id, product: product }));

    return React.createElement(
        'div',
        null,
        React.createElement(
            'table',
            { className: 'bordered-table' },
            React.createElement(
                'thead',
                null,
                React.createElement(
                    'th',
                    null,
                    'Product Name'
                ),
                React.createElement(
                    'th',
                    null,
                    'Price'
                ),
                React.createElement(
                    'th',
                    null,
                    'Category'
                ),
                React.createElement(
                    'th',
                    null,
                    'Image'
                )
            ),
            React.createElement(
                'tbody',
                null,
                productRows
            )
        )
    );
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAddForm;
        const price = form.price.value;
        const product = { product_name: form.product.value, product_price: parseFloat(price.substring(1, price.length)), product_category: form.productCategory.value, product_image: form.image.value };
        this.props.createProduct(product);
        form.product.value = "";
        form.price.value = "$";
        form.image.value = "";
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'form',
                { name: 'productAddForm', onSubmit: this.handleSubmit },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'column' },
                        React.createElement(
                            'h4',
                            { className: 'addFormTitle' },
                            'Product Category'
                        ),
                        React.createElement(
                            'select',
                            { name: 'productCategory' },
                            React.createElement(
                                'option',
                                null,
                                'Shirt'
                            ),
                            React.createElement(
                                'option',
                                null,
                                'Jeans'
                            ),
                            React.createElement(
                                'option',
                                null,
                                'Sweater'
                            ),
                            React.createElement(
                                'option',
                                null,
                                'Jacket'
                            ),
                            React.createElement(
                                'option',
                                null,
                                'Accessories'
                            )
                        ),
                        React.createElement(
                            'h4',
                            { className: 'addFormTitle' },
                            'Product Name'
                        ),
                        React.createElement('input', { type: 'text', name: 'product', placeholder: 'Product Name' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'column' },
                        React.createElement(
                            'h4',
                            { className: 'addFormTitle' },
                            'Product Price'
                        ),
                        React.createElement('input', { defaultValue: '$', type: 'text', name: 'price' }),
                        React.createElement(
                            'h4',
                            { className: 'addFormTitle' },
                            'Image URL'
                        ),
                        React.createElement('input', { type: 'text', name: 'image', placeholder: 'Product Image' })
                    )
                ),
                React.createElement('br', null),
                React.createElement(
                    'button',
                    null,
                    'Add Product'
                )
            )
        );
    }
}

function ProductRow({ product }) {

    return React.createElement(
        'tr',
        null,
        React.createElement(
            'td',
            null,
            product.product_name
        ),
        React.createElement(
            'td',
            null,
            '$',
            product.product_price
        ),
        React.createElement(
            'td',
            null,
            product.product_category
        ),
        React.createElement(
            'td',
            null,
            React.createElement(
                'a',
                { href: product.product_image, target: '_blank' },
                'View'
            )
        )
    );
};

const element = React.createElement(ProductList, null);

ReactDOM.render(element, document.getElementById('content'));