# Generated by Django 4.1.1 on 2022-10-05 14:54

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaign', '0002_alter_campaign_create_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='create_date',
            field=models.DateField(default=datetime.date(2022, 10, 5)),
        ),
    ]
