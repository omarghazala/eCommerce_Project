package com.oghazala.ecommerce.dao;

import com.oghazala.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "productCategories",path = "productCategories")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory,Long> {
}
