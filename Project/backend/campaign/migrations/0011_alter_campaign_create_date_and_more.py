# Generated by Django 4.1.1 on 2022-11-19 16:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaign', '0010_alter_campaign_create_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='create_date',
            field=models.DateField(default=datetime.date(2022, 11, 19)),
        ),
        migrations.AlterField(
            model_name='campaign',
            name='expire_date',
            field=models.DateField(default=datetime.date(2022, 11, 26)),
        ),
    ]