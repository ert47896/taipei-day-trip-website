FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY trip.conf /etc/nginx/sites-available/

RUN mkdir -p /etc/nginx/sites-enabled/\
    && ln -s /etc/nginx/sites-available/trip.conf /etc/nginx/sites-enabled/

CMD ["nginx", "-g", "daemon off;"]
