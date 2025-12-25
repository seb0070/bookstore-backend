const { Cart, CartItem, Book } = require('../models');

exports.addToCart = async (userId, data) => {
    const { book_id, quantity } = data;

    const book = await Book.findByPk(book_id);
    if (!book || book.status === 'DELETED') {
        const error = new Error('도서를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'BOOK_NOT_FOUND';
        throw error;
    }

    if (book.stock_quantity < quantity) {
        const error = new Error('재고가 부족합니다.');
        error.status = 422;
        error.code = 'INSUFFICIENT_STOCK';
        throw error;
    }

    // 장바구니 찾기 또는 생성
    let [cart] = await Cart.findOrCreate({
        where: { user_id: userId },
        defaults: { user_id: userId }
    });

    // 이미 장바구니에 있는지 확인
    const existingItem = await CartItem.findOne({
        where: { cart_id: cart.id, book_id }
    });

    if (existingItem) {
        // 수량 업데이트
        await existingItem.update({
            quantity: existingItem.quantity + quantity
        });
        return existingItem;
    } else {
        // 새 아이템 추가
        const cartItem = await CartItem.create({
            cart_id: cart.id,
            book_id,
            quantity
        });
        return cartItem;
    }
};

exports.getMyCart = async (userId) => {
    const cart = await Cart.findOne({
        where: { user_id: userId },
        include: [{
            model: CartItem,
            as: 'items',
            include: [{
                model: Book,
                as: 'book',
                attributes: ['id', 'title', 'price', 'cover_image', 'stock_quantity']
            }]
        }]
    });

    if (!cart) {
        return { items: [], total: 0 };
    }

    const items = cart.items.map(item => ({
        ...item.toJSON(),
        subtotal: item.quantity * parseFloat(item.book.price)
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, total };
};

exports.updateCartItem = async (userId, itemId, data) => {
    const { quantity } = data;

    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
        const error = new Error('장바구니를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'CART_NOT_FOUND';
        throw error;
    }

    const cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, book_id: itemId }
    });

    if (!cartItem) {
        const error = new Error('장바구니 항목을 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'CART_ITEM_NOT_FOUND';
        throw error;
    }

    // 재고 확인
    const book = await Book.findByPk(cartItem.book_id);
    if (book.stock_quantity < quantity) {
        const error = new Error('재고가 부족합니다.');
        error.status = 422;
        error.code = 'INSUFFICIENT_STOCK';
        throw error;
    }

    await cartItem.update({ quantity });
    return cartItem;
};

exports.removeFromCart = async (userId, bookId) => {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
        const error = new Error('장바구니를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'CART_NOT_FOUND';
        throw error;
    }

    const cartItem = await CartItem.findOne({
        where: { cart_id: cart.id, book_id: bookId }
    });

    if (!cartItem) {
        const error = new Error('장바구니 항목을 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'CART_ITEM_NOT_FOUND';
        throw error;
    }

    await cartItem.destroy();
    return { message: '장바구니에서 제거되었습니다.' };
};

exports.clearCart = async (userId) => {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (cart) {
        await CartItem.destroy({ where: { cart_id: cart.id } });
    }
    return { message: '장바구니가 비워졌습니다.' };
};