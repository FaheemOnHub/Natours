class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const hardQueryObject = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete hardQueryObject[el]);

    let queryString = JSON.stringify(hardQueryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matchedWord) => `$${matchedWord}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBY = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBY);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldQuery = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldQuery);
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skipNumber = (page - 1) * limit;
    this.query = this.query.skip(skipNumber).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
