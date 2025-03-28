# How to Run the Project

## Development Server

To start the development server, run the following command:

```sh
ng serve
```

---

## Chosen Approach for Data and Video Storage

While looking for a lightweight library to handle asynchronous operations and blob files, I found that `localStorage` was not the best option due to its size limitations.

---

## Assumptions and Challenges Faced

The biggest challenge was storing video locally. It was quite surprising, as most data is usually stored on the backend, while only small pieces of information are kept in `localStorage`—definitely not entire videos! 😄

I omitted some aesthetic components designed in Figma, such as the quality selection button, delete button, and video display modal. I wanted to focus more on handling data flow rather than on CSS, which can be time-consuming. Nevertheless, I believe that the most important functionalities were covered in this MVP version.

---

![Project](https://github.com/user-attachments/assets/30543819-77f5-4bdc-865e-54be06cdefa5)

