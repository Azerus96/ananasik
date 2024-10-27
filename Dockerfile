FROM python:3.8

WORKDIR /app

# Установка зависимостей
COPY requirements.txt .
RUN pip install -r requirements.txt

# Копирование файлов проекта
COPY . .

# Установка переменных окружения
ENV FLASK_APP=web/app.py
ENV FLASK_ENV=development

# Открытие порта
EXPOSE 5000

# Запуск приложения
CMD ["flask", "run", "--host=0.0.0.0"]
