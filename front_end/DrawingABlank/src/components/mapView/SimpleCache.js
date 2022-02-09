export default function SimpleCache(initContent = {}) {
  this.content = initContent;

  this.addEntry = ([
    key,
    content,
    refreshContent,
    //requestObject,
    //requesterObject,
    time_to_expire = 0, // default always get latest from backend
  ]) => {
    if (!content) {
      content = refreshContent();
    }

    expiry_date = Date.now() + time_to_expire;

    key = JSON.stringify(key);

    this.content[key] = [
      content, // promise
      refreshContent,
      expiry_date,
    ];
  };

  // return just the "content" field of an element
  this.getEntryContent = (key, getLatestFlag) => {
    e = this.getEntry(key, getLatestFlag)[0];
    return e;
  };

  this.setEntry = (key, cb) => {
    // cache fov is out of date
    // this.
  };

  this.getEntry = (key, getLatestFlag) => {
    key = JSON.stringify(key);
    entry = this.content[key];
    console.log('cahce', this.content);
    console.log('e', this.content[key]);
    if (!entry) return [false];

    const [content, refreshContent, expiry_date] = this.content[key];

    if (expiry_date >= Date.now() || getLatestFlag) {
      updatedElement = [refreshContent(), ...this.content[key]];
      this.content[key] = updatedElement;
      return updatedElement;
    } else {
      return this.content[key];
    }
  };
}
