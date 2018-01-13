INSERT INTO `zshop`.`product` (`id`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `createdAt`, `updatedAt`, `version`) VALUES (1, '魅蓝 Note1', '疾速双摄  1100万前置美拍', 1199.99, '/static/images/product/good1.jpg', 1, 0, now(), now(), 0)
INSERT INTO `zshop`.`product` (`id`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `createdAt`, `updatedAt`, `version`) VALUES (2, '魅蓝 Note2', '疾速双摄  1200万前置美拍', 1299.99, '/static/images/product/good2.jpg', 1, 2, now(), now(), 0)
INSERT INTO `zshop`.`product` (`id`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `createdAt`, `updatedAt`, `version`) VALUES (3, '魅蓝 Note3', '疾速双摄  1300万前置美拍', 1399.99, '/static/images/product/good3.jpg', null, 0, now(), now(), 0)
INSERT INTO `zshop`.`product` (`id`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `createdAt`, `updatedAt`, `version`) VALUES (4, '魅蓝 Note4', '疾速双摄  1400万前置美拍', 1499.99, '/static/images/product/good4.jpg', null, 0, now(), now(), 0)
INSERT INTO `zshop`.`product` (`id`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `createdAt`, `updatedAt`, `version`) VALUES (5, '魅蓝 Note5', '疾速双摄  1500万前置美拍', 1599.99, '/static/images/product/good5.jpg', 1, 3, now(), now(), 0)
INSERT INTO `zshop`.`product` (`id`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `createdAt`, `updatedAt`, `version`) VALUES (6, '魅蓝 Note6', '疾速双摄  1600万前置美拍', 1699.99, '/static/images/product/good6.jpg', 1, 5, now(), now(), 0)
INSERT INTO `zshop`.`product` (`id`, `name`, `description`, `price`, `image`, `recommend`, `sales`, `createdAt`, `updatedAt`, `version`) VALUES (7, '魅蓝 Note7', '疾速双摄  1700万前置美拍', 1799.99, '/static/images/product/good1.jpg', 1, 0, now(), now(), 0)

INSERT INTO `zshop`.`advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (1, '首页头部轮播广告图片1', null, 1, '/static/images/ad/s1.png', null, now(), now(), 0);
INSERT INTO `zshop`.`advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (2, '首页头部轮播广告图片2', null, 1, '/static/images/ad/s2.png', null, now(), now(), 0);
INSERT INTO `zshop`.`advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (3, '首页头部轮播广告图片3', null, 1, '/static/images/ad/s3.png', null, now(), now(), 0);
INSERT INTO `zshop`.`advert` (`id`, `name`, `description`, `position`, `image`, `url`, `createdAt`, `updatedAt`, `version`) VALUES (4, '首页中部广告图片', null, 2, '/static/images/ad/ad_mid.png', null, now(), now(), 0);

INSERT INTO `zshop`.`user` (`id`, `email`, `mobile`, `userId`, `passwd`, `name`, `gender`, `headImage`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), '768473188@qq.com', '18312345678', 'halloffame', '123456', '墨菲', 1, '/static/images/head/bear.jpg', now(), now(), 0);

INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (1, 'halloffame', 1, 3, now(), now(), 0);
INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (2, 'halloffame', 2, 2, now(), now(), 0);
INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (3, 'halloffame', 3, 1, now(), now(), 0);
INSERT INTO `cart` (`id`, `userId`, `prodId`, `count`, `createdAt`, `updatedAt`, `version`) VALUES (4, 'halloffame', 4, 1, now(), now(), 0);

INSERT INTO `group_prod_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 1, '颜色', now(), now(), 0);
INSERT INTO `group_prod_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 2, '版本', now(), now(), 0);
INSERT INTO `group_prod_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 3, '内存', now(), now(), 0);
INSERT INTO `group_prod_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 1, '套餐', now(), now(), 0);
INSERT INTO `group_prod_attri` (`id`, `prodGroup`, `attriId`, `attriName`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 2, '大小', now(), now(), 0);

INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 1, '深空灰', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 2, '公开版', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 1, 3, '64GB', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 1, '红色', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 2, '定制版', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 2, 3, '4GB', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 3, 1, '移动', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 3, 2, '5寸', now(), now(), 0);
INSERT INTO `prod_attri_value` (`id`, `prodId`, `attriId`, `attriValue`, `createdAt`, `updatedAt`, `version`) VALUES (UUID(), 4, 1, '联通', now(), now(), 0);
