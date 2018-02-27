INSERT INTO `product` (`id`, `groupId`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `stock`, `detailImages`, `detailHtml`, `createdAt`, `updatedAt`, `version`) VALUES (1, 1, '魅蓝 Note1', '疾速双摄  1100万前置美拍', 1199.99, '/static/images/product/good1.jpg', 1, 0, 55, 'prod_detail0.jpg;prod_detail1.jpg;prod_detail2.jpg', '/static/html/prod_detail/prod-detial0.html', now(), now(), 0)
INSERT INTO `product` (`id`, `groupId`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `stock`, `detailImages`, `detailHtml`, `createdAt`, `updatedAt`, `version`) VALUES (2, 1, '魅蓝 Note2', '疾速双摄  1200万前置美拍', 1299.99, '/static/images/product/good2.jpg', 1, 2, 3, 'prod_detail0.jpg;prod_detail1.jpg;prod_detail2.jpg', '/static/html/prod_detail/prod-detial0.html', now(), now(), 0)
INSERT INTO `product` (`id`, `groupId`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `stock`, `detailImages`, `detailHtml`, `createdAt`, `updatedAt`, `version`) VALUES (3, 3, '魅蓝 Note3', '疾速双摄  1300万前置美拍', 1399.99, '/static/images/product/good3.jpg', null, 0, 2, 'prod_detail0.jpg;prod_detail1.jpg;prod_detail2.jpg', '/static/html/prod_detail/prod-detial0.html', now(), now(), 0)
INSERT INTO `product` (`id`, `groupId`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `stock`, `detailImages`, `detailHtml`, `createdAt`, `updatedAt`, `version`) VALUES (4, 3, '魅蓝 Note4', '疾速双摄  1400万前置美拍', 1499.99, '/static/images/product/good4.jpg', null, 0, 88, 'prod_detail0.jpg;prod_detail1.jpg;prod_detail2.jpg', '/static/html/prod_detail/prod-detial0.html', now(), now(), 0)
INSERT INTO `product` (`id`, `groupId`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `stock`, `detailImages`, `detailHtml`, `createdAt`, `updatedAt`, `version`) VALUES (5, 5, '魅蓝 Note5', '疾速双摄  1500万前置美拍', 1599.99, '/static/images/product/good5.jpg', 1, 3, 99, 'prod_detail0.jpg;prod_detail1.jpg;prod_detail2.jpg', '/static/html/prod_detail/prod-detial0.html', now(), now(), 0)
INSERT INTO `product` (`id`, `groupId`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `stock`, `detailImages`, `detailHtml`, `createdAt`, `updatedAt`, `version`) VALUES (6, 6, '魅蓝 Note6', '疾速双摄  1600万前置美拍', 1699.99, '/static/images/product/good6.jpg', 1, 5, 44, 'prod_detail0.jpg;prod_detail1.jpg;prod_detail2.jpg', '/static/html/prod_detail/prod-detial0.html', now(), now(), 0)
INSERT INTO `product` (`id`, `groupId`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `stock`, `detailImages`, `detailHtml`, `createdAt`, `updatedAt`, `version`) VALUES (7, 1, '魅蓝 Note7', '疾速双摄  1700万前置美拍', 1799.99, '/static/images/product/good1.jpg', 1, 0, 33, 'prod_detail0.jpg;prod_detail1.jpg;prod_detail2.jpg', '/static/html/prod_detail/prod-detial0.html', now(), now(), 0)

INSERT INTO `advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (1, '首页头部轮播广告图片1', null, 1, '/static/images/vt/s1.png', null, now(), now(), 0);
INSERT INTO `advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (2, '首页头部轮播广告图片2', null, 1, '/static/images/vt/s2.png', null, now(), now(), 0);
INSERT INTO `advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (3, '首页头部轮播广告图片3', null, 1, '/static/images/vt/s3.png', null, now(), now(), 0);
INSERT INTO `advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (4, '首页中部广告图片', null, 2, '/static/images/vt/mid.png', null, now(), now(), 0);

INSERT INTO `user` (`id`, `email`, `mobile`, `userId`, `passwd`, `name`, `gender`, `headImage`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), '768473188@qq.com', '18312345678', 'halloffame', '123456', '墨菲', 1, '/static/images/head/bear.jpg', now(), now(), 0);

INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (1, 'halloffame', 1, 3, now(), now(), 0);
INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (2, 'halloffame', 2, 2, now(), now(), 0);
INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (3, 'halloffame', 3, 1, now(), now(), 0);
INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (4, 'halloffame', 4, 1, now(), now(), 0);

INSERT INTO `group_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (1, 1, 'colour', '颜色', now(), now(), 0);
INSERT INTO `group_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (2, 1, 'version', '版本', now(), now(), 0);
INSERT INTO `group_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (3, 1, 'memory', '内存', now(), now(), 0);
INSERT INTO `group_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (4, 3, 'meal', '套餐', now(), now(), 0);
INSERT INTO `group_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (5, 3, 'size', '大小', now(), now(), 0);

INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (1, 1, '深空灰', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (2, 1, '红色', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (10, 1, '蓝色', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (3, 2, '公开版', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (4, 2, '定制版', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (5, 3, '64GB', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (6, 3, '4GB', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (7, 4, '移动', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (8, 4, '联通', now(), now(), 0);
INSERT INTO `group_attri_value` (`id`, `groupAttriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (9, 5, '5寸', now(), now(), 0);

INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 1, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 3, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 5, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 2, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 4, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 6, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 3, 7, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 3, 9, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 4, 8, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 7, 1, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 7, 4, now(), now(), 0);
INSERT INTO `prod_attri` (`id`, `prodId`, `groupAttriValueId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 7, 5, now(), now(), 0);

INSERT INTO `collection` (`id`, `userId`, `prodId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 'halloffame', 2, now(), now(), 0);
INSERT INTO `collection` (`id`, `userId`, `prodId`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 'halloffame', 1, now(), now(), 0);
